import { Command } from '@oclif/core';
import { createConnectionOptions } from '@subsquid/typeorm-config';
import * as dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pgtools = require('pgtools');

export default class CreateDb extends Command {
  static description = 'Create database';

  async run(): Promise<void> {
    dotenv.config();
    const cfg = createConnectionOptions();
    try {
      await pgtools.createdb(
        {
          host: cfg.host,
          port: cfg.port,
          user: cfg.username,
          password: cfg.password,
        },
        cfg.database,
      );
    } catch (e: any) {
      if (e?.name === 'duplicate_database') {
        this.log(`Database '${cfg.database}' already exists`);
      } else {
        this.error(e);
      }
    }
  }
}
