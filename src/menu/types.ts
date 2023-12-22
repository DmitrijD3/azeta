export type CategoryList = {
  id: string;
  parent: string | null;
  name: string;
  level: number;
  left: number;
  right: number;
  children: CategoryList[];
};
