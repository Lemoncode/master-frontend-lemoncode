import * as apiModel from './api/list.api-model';
import * as viewModel from './list.vm';
import { mapToCollection } from 'common/mappers';

export const mapItemListFromApiToVm = (
  itemList: apiModel.Item[]
): viewModel.Item[] => mapToCollection(itemList, (item) => ({ ...item }));
