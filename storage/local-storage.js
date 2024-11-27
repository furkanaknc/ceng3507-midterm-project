export function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function get(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
}