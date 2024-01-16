const passportStrategiesEnum = {
    CURRENT: 'jwt',
    LOGIN: "login",
    REGISTER: 'register',
    GITHUB:'github',
    NOTHING: 'na'
};

const accessRolesEnum = {
    ADMIN: 'admin',
    USER: 'user',
    PUBLIC: 'public'
};

export {
    passportStrategiesEnum,
    accessRolesEnum
}