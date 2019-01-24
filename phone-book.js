'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
const phoneBook = {};

function checkValid(phone, name, email) {
    const phonePattern = new RegExp('^\\d{10}$');
    const phoneValid = typeof phone === 'string' && phonePattern.test(phone);
    const nameValid = typeof name === 'string' && name !== '';
    const emailValid = email !== undefined ? typeof email === 'string' : true;

    return phoneValid && nameValid && emailValid;
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (checkValid(phone, name, email) && !(phone.replace(/[^0-9]+/, '') in phoneBook)) {
        phoneBook[phone] = [name];
        if (email) {
            phoneBook[phone].push(email);
        }

        return true;
    }

    return false;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (checkValid(phone, name, email) && (phone.replace(/[^0-9]+/, '') in phoneBook)) {
        phoneBook[phone][0] = name;
        if (email !== '' && email) {
            phoneBook[phone][1] = email;
        } else {
            phoneBook[phone].splice(1, 1);
        }

        return true;
    }

    return false;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let count = 0;
    if (query === '' || query === undefined || typeof query !== 'string') {

        return count;
    }
    Object.keys(phoneBook).map(numberPhone => {
        const phone = numberPhone.indexOf(query);
        const name = phoneBook[numberPhone][0].indexOf(query);
        let email = -1;
        if (phoneBook[numberPhone][1]) {
            email = phoneBook[numberPhone][1].indexOf(query);
        }
        if (phone !== -1 || name !== -1 || email !== -1 || query === '*') {
            delete phoneBook[numberPhone];
            count++;
        }

        return false;
    }
    );

    return count;
}

function findQuery(key, name, email, query) {
    const checkPhone = key.indexOf(query);
    const checkName = name.indexOf(query);
    const checkEmail = email ? email.indexOf(query) : -1;
    if (checkPhone !== -1 || checkName !== -1 || checkEmail !== -1) {

        return true;
    }

    return false;
}

function formattingPhone(number) {
    let phone = [];
    phone[0] = '+7 (' + number.slice(0, 3) + ') ';
    phone[1] = number.slice(3, 6) + '-';
    phone[2] = number.slice(6, 8) + '-';
    phone[3] = number.slice(8);

    return phone[0] + phone[1] + phone[2] + phone[3];
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let listQuery = [];
    if (!query || query === '' || typeof query !== 'string') {

        return listQuery;
    }
    Object.keys(phoneBook).map(objectKey => {
        const number = objectKey;
        const name = phoneBook[objectKey][0];
        const email = phoneBook[objectKey][1];
        if (query === '*' || findQuery(number, name, email, query)) {
            const phone = formattingPhone(number);
            const emailTrue = (email !== undefined && email !== '') ? ', ' + email : '';
            let item = name + ', ' + phone + emailTrue;
            listQuery.push(item);
        }

        return false;
    }
    );

    return listQuery.sort();
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    let count = 0;
    const array = csv.split('\n');
    array.forEach(
        function (item) {
            const [name, phone, email] = item.split(';');
            if (checkValid(phone, name, email)) {
                phoneBook[phone] = [name];
                count++;
            }
            if (checkValid(phone, name, email) && email) {
                phoneBook[phone][1] = email;
            }
        }
    );

    return count;
}


module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,
    isStar
};
