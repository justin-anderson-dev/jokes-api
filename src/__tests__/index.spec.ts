import { server } from '../index';
import http from 'http';

describe('Server creation', () => {
  test('server should be defined', () => {
    expect(server).toBeDefined();
  });

  test('server should be an instance of http.Server', () => {
    expect(server).toBeInstanceOf(http.Server);
  });
});
