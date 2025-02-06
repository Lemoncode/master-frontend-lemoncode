const url = '/graphql';

interface GraphqlProps<Variables> {
  query: string;
  variables?: Variables;
}

export const graphql = async <Response, Variables = unknown>(
  props: GraphqlProps<Variables>
): Promise<Response> => {
  const { query, variables } = props;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const { data, errors } = await response.json();

  if (errors) {
    console.error(errors);
  }

  return data;
};
