export namespace Element {
  enum TypeEnum {
    FUNCTION = "function",
  }

  type Scheam = {
    name: Readonly<string>;
    label: Readonly<string>;
    type: Readonly<ElementType>;
  };
}
