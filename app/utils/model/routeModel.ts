export enum RouteTypes {
  Guest,
  Public,
  Private,
}

export interface IRoute {
  type: RouteTypes;
}
