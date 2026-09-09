import type { ExamService } from '@/features/exams/services/exam-service';
import type {
  Exam,
  ExamFormValues,
  ExamListQuery,
  ExamStudent,
  SaveStudentMarksInput,
  StudentResult,
  SubjectMark,
} from '@/features/exams/types';
import { classMocks } from '@/mocks/classes';
import { examMocks } from '@/mocks/exams';
import { makeAttendanceRoster } from '@/mocks/attendance';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
const clone = <Value>(value: Value): Value => structuredClone(value);

export class ExamNotFoundError extends Error {
  constructor(message = 'This exam could not be found.') {
    super(message);
    this.name = 'ExamNotFoundError';
  }
}

export class MarksValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MarksValidationError';
  }
}

function gradeFor(percentage: number) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

function calculateResult(
  exam: Exam,
  student: ExamStudent,
  marks: SubjectMark[],
): StudentResult {
  const obtainedMarks = marks.reduce((sum, item) => sum + (item.marks ?? 0), 0);
  const totalMarks = exam.subjects.reduce(
    (sum, subject) => sum + subject.maxMarks,
    0,
  );
  const percentage = totalMarks
    ? Number(((obtainedMarks / totalMarks) * 100).toFixed(1))
    : 0;
  const missing = marks.filter((item) => item.marks === null).length;
  const failed = marks.some((item) => {
    const subject = exam.subjects.find(
      (candidate) => candidate.id === item.subjectId,
    );
    return item.marks !== null && subject && item.marks < subject.passMarks;
  });
  return {
    examId: exam.id,
    student,
    marks,
    obtainedMarks,
    totalMarks,
    percentage,
    grade: missing ? '—' : gradeFor(percentage),
    status:
      missing === marks.length
        ? 'absent'
        : missing
          ? 'incomplete'
          : failed
            ? 'fail'
            : 'pass',
  };
}

function makeResults(exam: Exam) {
  const classSection = classMocks.find(
    (item) => item.id === exam.classSectionId,
  );
  if (!classSection)
    throw new ExamNotFoundError('The exam class could not be found.');
  return makeAttendanceRoster(classSection).map((record, studentIndex) => {
    const student = {
      id: record.id,
      name: `${record.firstName} ${record.lastName}`,
      rollNumber: record.rollNumber,
    };
    const marks = exam.subjects.map((subject, subjectIndex) => {
      const marker = studentIndex + subjectIndex * 3;
      const score =
        marker % 19 === 0
          ? null
          : marker % 11 === 0
            ? subject.passMarks - 4
            : Math.min(subject.maxMarks, 58 + ((marker * 7) % 37));
      return { subjectId: subject.id, marks: score };
    });
    return calculateResult(exam, student, marks);
  });
}

export class MockExamService implements ExamService {
  private exams = clone(examMocks);
  private results = new Map<string, StudentResult[]>();

  constructor(private readonly latency = 220) {}

  private async pause() {
    if (this.latency) await wait(this.latency);
  }

  private exam(id: string) {
    const exam = this.exams.find((item) => item.id === id);
    if (!exam) throw new ExamNotFoundError();
    return exam;
  }

  private resultRows(exam: Exam) {
    const existing = this.results.get(exam.id);
    if (existing) return existing;
    const generated = makeResults(exam);
    this.results.set(exam.id, generated);
    return generated;
  }

  async list(query: ExamListQuery) {
    await this.pause();
    const search = query.search?.trim().toLowerCase() ?? '';
    return clone(
      this.exams.filter(
        (exam) =>
          (query.campusId === 'all' || exam.campusId === query.campusId) &&
          (!search ||
            exam.name.toLowerCase().includes(search) ||
            exam.className.toLowerCase().includes(search)) &&
          (!query.status ||
            query.status === 'all' ||
            exam.status === query.status),
      ),
    );
  }

  async get(id: string) {
    await this.pause();
    return clone(this.exam(id));
  }

  async create(values: ExamFormValues) {
    await this.pause();
    const classSection = classMocks.find(
      (item) => item.id === values.classSectionId,
    );
    if (!classSection)
      throw new ExamNotFoundError('Select a valid class section.');
    const id = `exam-${Date.now()}-${this.exams.length + 1}`;
    const exam: Exam = {
      id,
      name: values.name.trim(),
      term: values.term,
      academicYear: values.academicYear,
      campusId: values.campusId,
      campusName: classSection.campusName,
      className: classSection.gradeName as Exam['className'],
      section: classSection.section as Exam['section'],
      classSectionId: values.classSectionId,
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status,
      subjects: values.subjects.map((subject, index) => ({
        ...subject,
        name: subject.name.trim(),
        id: `${id}-subject-${index + 1}`,
      })),
    };
    this.exams.unshift(exam);
    return clone(exam);
  }

  async getResults(examId: string) {
    await this.pause();
    const exam = this.exam(examId);
    return clone(this.resultRows(exam));
  }

  async getStudentResult(examId: string, studentId: string) {
    await this.pause();
    const exam = this.exam(examId);
    const result = this.resultRows(exam).find(
      (item) => item.student.id === studentId,
    );
    if (!result)
      throw new ExamNotFoundError('This student result could not be found.');
    return clone(result);
  }

  async saveMarks(examId: string, rows: SaveStudentMarksInput[]) {
    await this.pause();
    const exam = this.exam(examId);
    const current = this.resultRows(exam);
    const next = current.map((result) => {
      const incoming = rows.find((row) => row.studentId === result.student.id);
      if (!incoming) return result;
      if (incoming.marks.length !== exam.subjects.length)
        throw new MarksValidationError(
          'Every subject needs a marks entry or Absent.',
        );
      incoming.marks.forEach((mark) => {
        const subject = exam.subjects.find(
          (item) => item.id === mark.subjectId,
        );
        if (!subject) throw new MarksValidationError('Unknown exam subject.');
        if (
          mark.marks !== null &&
          (!Number.isFinite(mark.marks) ||
            mark.marks < 0 ||
            mark.marks > subject.maxMarks)
        )
          throw new MarksValidationError(
            `${subject.name} marks must be between 0 and ${subject.maxMarks}.`,
          );
      });
      return calculateResult(exam, result.student, incoming.marks);
    });
    this.results.set(exam.id, next);
    return clone(next);
  }

  async getSummary(examId: string) {
    await this.pause();
    const exam = this.exam(examId);
    const results = this.resultRows(exam);
    const completed = results.filter(
      (result) => result.status === 'pass' || result.status === 'fail',
    );
    const passed = results.filter((result) => result.status === 'pass').length;
    return {
      students: results.length,
      subjects: exam.subjects.length,
      averagePercentage: completed.length
        ? Number(
            (
              completed.reduce((sum, result) => sum + result.percentage, 0) /
              completed.length
            ).toFixed(1),
          )
        : 0,
      passRate: completed.length
        ? Math.round((passed / completed.length) * 100)
        : 0,
    };
  }
}
