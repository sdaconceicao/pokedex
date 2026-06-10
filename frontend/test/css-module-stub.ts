const cssModuleStub = new Proxy(
  {},
  {
    get: (_target, prop: string) => prop,
  }
);

export default cssModuleStub;
