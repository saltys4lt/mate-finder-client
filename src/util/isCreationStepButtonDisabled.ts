import { TeamCreationDataValidation } from '../types/TeamCreationDataValidation';

export default (dataValidation: TeamCreationDataValidation, creationStep: number, ownerRole: string) => {
  if (creationStep === 1) {
    return true;
  }
  if (creationStep === 2 && dataValidation.isNameValid && dataValidation.isDescriptionValid) {
    return true;
  }
  if (creationStep === 3 && ownerRole !== '') {
    return true;
  }
  if (creationStep === 4 && dataValidation.isRolesValid) {
    return true;
  }

  return false;
};
