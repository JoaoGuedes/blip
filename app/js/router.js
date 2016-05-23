export class Router {

    /**
     * Receives parameter, query string and expression to look parameter upon
     * @returns Value if found or undefined
     */
    static getParamFromRegex(key, search, regex) {
        let m, occurrences = [];
        while ((m = regex.exec(search)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            occurrences.push(m[0]);
        }

        if (occurrences.length > 0) {
            let result;
            occurrences.forEach(entry => {
                let tokens = entry.split('=');
                if (tokens[0].toUpperCase() === key.toUpperCase()) {
                    result = tokens[1];
                }
            });
            return result;
        }

        return undefined;
    }

    /**
     * Fetches param from query string
     */
    static getParam(key) {
        return this.getParamFromRegex(key, window.location.search, /([A-Za-z0-9]+=[A-Za-z0-9]+)/g)
    }

    /**
     * Change URL
     */
    static go(url) {
        window.location.assign(url);
    }

}
