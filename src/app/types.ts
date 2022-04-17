/**
 * Set new properties in the interface of global NodeJs
 */
declare namespace NodeJS {
  interface Global {
    globalSocket: any;
  }
}
