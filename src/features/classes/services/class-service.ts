import type { ClassService } from '@/features/classes/types';
import { classMocks } from '@/mocks/classes';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export class ClassNotFoundError extends Error {
  constructor() {
    super('This class section could not be found.');
    this.name = 'ClassNotFoundError';
  }
}

export class MockClassService implements ClassService {
  constructor(private readonly latency = 220) {}

  async list(query: Parameters<ClassService['list']>[0]) {
    if (this.latency) await wait(this.latency);
    const search = query.search.trim().toLocaleLowerCase();
    return structuredClone(
      classMocks.filter(
        (item) =>
          (query.campusId === 'all' || item.campusId === query.campusId) &&
          (!search ||
            [
              item.gradeName,
              item.section,
              item.classTeacherName,
              item.room,
            ].some((value) => value.toLocaleLowerCase().includes(search))),
      ),
    );
  }

  async get(id: string) {
    if (this.latency) await wait(this.latency);
    const item = classMocks.find((candidate) => candidate.id === id);
    if (!item) throw new ClassNotFoundError();
    return structuredClone(item);
  }
}

export const classService = new MockClassService();
