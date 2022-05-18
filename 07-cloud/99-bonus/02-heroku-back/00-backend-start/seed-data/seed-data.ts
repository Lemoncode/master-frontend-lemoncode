import { ObjectId } from 'mongodb';
import { connectToDBServer, disconnectFromDbServer } from '../src/core/servers';
import { envConstants } from '../src/core/constants';
import { insertMemberList, Member } from '../src/dals/member';

const devMemberList: Member[] = [
  {
    _id: new ObjectId().toHexString(),
    login: 'brauliodiez',
    avatarUrl: 'https://avatars1.githubusercontent.com/u/1457912?v=4',
    organization: 'lemoncode',
  },
  {
    _id: new ObjectId().toHexString(),
    login: 'jaimesalas',
    avatarUrl: 'https://avatars.githubusercontent.com/u/7754966?v=4',
    organization: 'lemoncode',
  },
  {
    _id: new ObjectId().toHexString(),
    login: 'nasdan',
    avatarUrl: 'https://avatars2.githubusercontent.com/u/4374977?v=4',
    organization: 'lemoncode',
  },
];

const prodMemberList: Member[] = [
  {
    _id: new ObjectId().toHexString(),
    login: 'gaearon',
    avatarUrl: 'https://avatars2.githubusercontent.com/u/810438?v=4',
    organization: 'facebook',
  },
  {
    _id: new ObjectId().toHexString(),
    login: 'acdlite',
    avatarUrl: 'https://avatars0.githubusercontent.com/u/3624098?v=4',
    organization: 'facebook',
  },
];

export const run = async () => {
  await connectToDBServer(envConstants.MONGODB_URI);

  const memberList = envConstants.isProduction ? prodMemberList : devMemberList;
  console.log({ memberList });

  await insertMemberList(memberList);
  console.log('Inserted member list');

  await disconnectFromDbServer();
};

run();
