
/**
 * 
 *      ------------------------------------------
 *      col1    |   col2    |   col3                | 
 *              |           |   col3-1  |   col3-2  |      
 * 
 *      
 * 
 *           
 */

export const columns = [
    {
        field: 'col1',
        key: 'col1',
        title: 'col1'
    },
    {
        field: 'col2',
        key: 'col2',
        title: 'col2'
    },
    {
        field: 'col3',
        key: 'col3',
        title: 'col3',
        children: [
            {
                field: 'col3-1',
                key: 'col3-1',
                title: 'col3-1',
            },
            {
                field: 'col3-2',
                key: 'col3-2',
                title: 'col3-2',
            }
        ]
    }
]