import { swCreateUser, swDeleteUser, swFindByEmail, swGetAllUsers, swGetMe, swGetUser, swPatchUser, swSignIn } from "./docs";

export const swUserRoute = {
    "/users/sign_in": {
        "post": {
            ...swSignIn
        }
    },
    "/users/me" : {
        "get": {
            ...swGetMe
        }
    },
    "/users/{email}": {
        "get": {
            ...swGetUser
        },
        "patch": {
            ...swPatchUser
        },
        "delete": {
            ...swDeleteUser
        }
    },
    "/users": {
        "get": {
            ...swGetAllUsers
        },
        "post": {
            ...swCreateUser
        }
    },
    "/users/users?{email}={someEmail}": {
        "get": {
            ...swFindByEmail
        }
    }
}