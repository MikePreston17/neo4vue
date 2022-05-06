// Scratch

class NeoQ {
  pwd: any;
  db: any;

  processes: Promise<any>[];

  constructor(db, pwd) {
    this.db = db;
    this.pwd = pwd;
  }

  login() {
    // TODO: login to neo4j
  }

  enqueue<T>(func: Promise<T>) {
    this.processes.push(func);
  }

  dequeue() {
    return this.processes.shift();
  }

  peek() {
    return this.processes?.[0];
  }
}
