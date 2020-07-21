/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
    const arr = {};
    for(const num of nums) {
        if (arr[num]) {
            return true;
        }
        arr[num] = true;
    }
    return false;
};
