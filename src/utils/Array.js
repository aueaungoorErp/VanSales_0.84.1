export const removeDuplicateArr = (obj, key) => {
    const filteredArr = obj.reduce((acc, current) => {
        const x = acc.find(item => item[key] === current[key])
        if (!x) {
            return acc.concat([current])
        } else {
            return acc
        }
    }, [])

    return filteredArr
}