export const fetchCones = ( method, data, projectId, callback ) => {
    let msg = "Something went wrong! Couldn't execute task :(";
    let desc = "";
    fetch(`http://localhost:8080/projects/${projectId}/cones`, {
        method: method,
        body: data,
    }).then( response => {
        if (response.status === 200) {
            response.json().then(result => {
                return result;
            }).catch(error => {
                console.log(error);
            })
        } else {
            response.json().then(result => {
                desc = "ERROR " + result.status + " " + result.message;
                throw { message: desc, open: true, title: msg, variant: "warning"}
            }).catch(error => {
                console.log(error);
                desc = "ERROR " + response.status;
                throw { message: desc, open: true, title: msg, variant: "warning"}
            })
        }
    }).catch(error => {
        console.log(error);
        throw { message: msg, open: true, variant: "error" }
    }).finally(() => {
        if (typeof callback === 'function') callback();
    });
};

