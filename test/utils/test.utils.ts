import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../src/shared/database/database.service.js';

@Injectable()
export class TestUtils {
  databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('ERROR TEST UTILS ONLY FOR TESTS');
    }
    this.databaseService = databaseService;
  }

  async resetDb() {
    try {
      await this.databaseService.dropDatabase();
    } catch (e) {
      console.error('reset db error ->', e);
    }
  }
}
