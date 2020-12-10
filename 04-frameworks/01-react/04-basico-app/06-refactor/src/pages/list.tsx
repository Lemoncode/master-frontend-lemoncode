import React from "react";
import { Link, generatePath } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

interface MemberEntity {
  id: string;
  login: string;
  avatar_url: string;
}

export const ListPage: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/orgs/lemoncode/members`)
      .then((response) => response.json())
      .then((json) => setMembers(json));
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="list table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Avatar</TableCell>
              <TableCell align="right">Id</TableCell>
              <TableCell align="right">Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.login}>
                <TableCell>
                  <img src={member.avatar_url} style={{ width: "2rem" }} />
                </TableCell>
                <TableCell align="right">{member.id}</TableCell>
                <TableCell align="right">
                  <Link to={generatePath("/detail/:id", { id: member.login })}>
                    {member.login}
                  </Link>{" "}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
