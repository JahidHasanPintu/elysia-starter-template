import { createUserType } from "../api/user/user.model";

export const db = {
  insert: {
    user: createUserType,
  },
};
