import { routes } from "@/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { MemberEntity } from "./list.vm";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";

interface Props {
  members: MemberEntity[];
}

export const ListComponent: React.FC<Props> = (props) => {
  const { members } = props;
  const navigate = useNavigate();

  return (
    <>
      <h2>Hello from List page</h2>

      <List>
        {members.map((member) => (
          <>
            <ListItem key={member.id} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={() => navigate(routes.details(member.login))}
                dense
              >
                <ListItemAvatar>
                  <Avatar alt={member.login} src={member.avatar_url} />
                </ListItemAvatar>
                <ListItemText
                  primary={member.login}
                  secondary={<Typography>{member.id}</Typography>}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </>
  );
};
