//This type uses a generic (<T>).  For more information on generics see: https://www.typescriptlang.org/docs/handbook/2/generics.html
//You probably wont need this for the scope of this class :)
export type ApiResponse<T> = {
  data: T;
  errors: ApiError[];
  hasErrors: boolean;
};

export type ApiError = {
  property: string;
  message: string;
};

export type AnyObject = {
  [index: string]: any;
};

export type UserDto = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;

  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  userType: string;
  bloodType: string;

  createDate: string;
  updateDate: string;
  
  lastDonationDate: string;
   profilePicture?: string | null; 
   role: string;

};


export type DonationDto = {
  id: number;
  donorName: string;
  hospitalName: string;
  bloodTypeName: string;
  unitsDonated: number;
  date: string;
  safeAt?: string | null;
};

export type DonationHistoryGetDto = {
  id: number;
  donorName: string;
  hospitalName: string;
  bloodTypeName: string;
  unitsDonated: number;
  date: string;
  safeAt?: string | null;
};

export type DonationHistoryCreateDto = {
  userId: number;
  hospitalId: number;
  bloodTypeId: number;
  unitsDonated: number;
};