import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface ParamProps {
  name: string;
}

interface Props extends RouteComponentProps<ParamProps> {}

export const UserEdit: React.FunctionComponent<Props> = (props) => {
  return <h1>User name: {props.match.params.name}</h1>;
};
