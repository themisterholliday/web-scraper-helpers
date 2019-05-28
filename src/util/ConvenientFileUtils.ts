import fs from 'fs';

export function promiseWriteFile(fileName: any, object: any): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, object, (err: any) =>
      err ? reject(err) : resolve(),
    );
  });
}

export function promiseReadFile(fileName: string, type: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, type, (err: any, data: any) =>
      err ? reject(err) : resolve(data),
    );
  });
}
