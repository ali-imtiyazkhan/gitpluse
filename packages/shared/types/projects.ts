export type OptionsTypesProps = {
  sort?: "stars";
  order?: "desc";
  per_page?: number;
  page?: number;
};

export type RepositoryProps = {
  id: string;
  name: string;
  description: string;
  url: string;
  owner: {
    avatarUrl: string;
  };
  issues: {
    totalCount: number;
  };
  primaryLanguage: {
    name: string;
  };
};

export type GraphQLResponseProps = {
  search: {
    nodes: RepositoryProps[];
    repositoryCount: number;
  };
};
