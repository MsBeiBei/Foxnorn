export const genKey = (part) => (...args) => part + '-' + args.join('-')
