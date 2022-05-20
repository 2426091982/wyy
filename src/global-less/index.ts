const fileRegex = /\.(less)$/;

export default function importGlobalLess() {
    return {
        name: 'globalLess',
        transform(src: string, id: string) {
            if (fileRegex.test(id)) {
                return {
                    code: () => {
                        console.log(src);
                    },
                    map: null, // 如果可行将提供 source map
                };
            }
        },
    };
}
