import * as apiModel from './api/image-list.api.model';
import * as viewModel from './image-list.vm';

const mapImageFromApiToVM = (image: apiModel.Image): viewModel.Image => {

    let vm: viewModel.Image = {
        id: image.id,
        description: image.description,
        image: image.imagePath,
        buy: false,
    };

    return vm;
};

export const mapImageListFromApiToVM = (
    imageList: apiModel.Image[]
): viewModel.Image[] => imageList.map(image => mapImageFromApiToVM(image));