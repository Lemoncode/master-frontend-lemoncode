import { Router } from 'express';
import { getMemberList } from 'dals/member';
import { mapMemberListFromModelToApi } from './member.mappers';

export const memberApi = Router();

memberApi.get('/:organization', async (req, res) => {
  try {
    const { organization } = req.params;
    const memberList = await getMemberList(organization);
    res.send(mapMemberListFromModelToApi(memberList));
  } catch (error) {
    res.sendStatus(400);
  }
});
