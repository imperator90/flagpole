export interface iJPath {
    search(searchIn: any, path: string): Promise<any>
}

/**
 * Simple JSON querying
 */
export class jPath implements iJPath {

    public search(searchIn: any, path: string): Promise<any> {
        const selectPath: string[] = this._getSelectPath(path);
        // Start searching on either the find in json or the root json
        let selection: any = searchIn || {};
        // If we find a value that matches all
        selectPath.every((part: string) => {
            selection = selection[part];
            return (typeof selection !== 'undefined');
        });
        return selection;
    }

    private _getSelectPath(path: string): string[] {
        // Replace [ and ] and space with .
        path = path.replace(/[\[\] ]/g, '.');
        // Remove quotes
        path = path.replace(/['"]/g, '');
        // Fix the situation where ]. will create .. (remove any cases of multiple dots)
        path = path.replace(/\.{2,}/g, '.');
        // Get array of each part
        return path.split('.');
    }

}