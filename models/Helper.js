module.exports = {

    allPossibleCases: function(arr) {
        if (arr.length === 1) {
            if(Array.isArray(arr[0])) {
                return arr[0];
            } else {
                return [arr[0]];
            }
        } else {
            let result = [];
            const allCasesOfRest = this.allPossibleCases(arr.slice(1));  // recur with the rest of array
            for (let i = 0; i < allCasesOfRest.length; i++) {
                for (let j = 0; j < arr[0].length; j++) {
                    if(Array.isArray(allCasesOfRest[i])) {
                        result.push([arr[0][j], ...allCasesOfRest[i]]);
                    } else {
                        result.push([arr[0][j], allCasesOfRest[i]]);
                    }
                }
            }
            return result;
        }

    }
};
