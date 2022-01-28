module.exports = {
    names: function(firstName, dayOfBirth){
        let firstNames = new Map()
        let daysOfBirth = new Map()
        let yourName

        firstNames.set("а", "Сокрушитель"); daysOfBirth.set(1, "школьников")
        firstNames.set("б", "Любитель");    daysOfBirth.set(2, "арбузов")
        firstNames.set("в", "Ценитель");    daysOfBirth.set(3, "говнарей")
        firstNames.set("г", "Метатель");    daysOfBirth.set(4, "олдфагов")
        firstNames.set("д", "Гроза");       daysOfBirth.set(5, "вагин")
        firstNames.set("е", "Повелитель");  daysOfBirth.set(6, "демонов")
        firstNames.set("ж", "Пожинатель");  daysOfBirth.set(7, "депутатов")
        firstNames.set("з", "Победитель");  daysOfBirth.set(8, "котят")
        firstNames.set("и", "Опустошитель");daysOfBirth.set(9, "жнецов")
        firstNames.set("к", "Хейтер");      daysOfBirth.set(10, "жиров")
        firstNames.set("л", "Убийца");      daysOfBirth.set(11, "самок")
        firstNames.set("м", "Растворитель");daysOfBirth.set(12, "мужиков")
        firstNames.set("н", "Дрочитель");   daysOfBirth.set(13, "пухляшей")
        firstNames.set("о", "Предводитель");daysOfBirth.set(14, "трапов")
        firstNames.set("п", "Воин");        daysOfBirth.set(15, "говна")
        firstNames.set("р", "Адепт");       daysOfBirth.set(16, "света")
        firstNames.set("с", "Уборщик");     daysOfBirth.set(17, "троллей")
        firstNames.set("т", "Почитатель");  daysOfBirth.set(18, "орков")
        firstNames.set("у", "Создатель");   daysOfBirth.set(19, "наномашин")
        firstNames.set("ф", "Фанатик");     daysOfBirth.set(20, "дрыщей")
        firstNames.set("х", "Вождь");       daysOfBirth.set(21, "веганов")
        firstNames.set("ц", "Жрец");        daysOfBirth.set(22, "моралфагов")
        firstNames.set("ч", "Преслужник");  daysOfBirth.set(23, "душ")
        firstNames.set("ш", "Экзорцист");   daysOfBirth.set(24, "фемок")
        firstNames.set("э", "Владыка");     daysOfBirth.set(25, "торчков")
        firstNames.set("ю", "Священник");   daysOfBirth.set(26, "паладинов")
        firstNames.set("я", "Призыватель"); daysOfBirth.set(27, "сосисок")
                                            daysOfBirth.set(28, "качков")
                                            daysOfBirth.set(29, "админов")
                                            daysOfBirth.set(30, "ботов")
                                            daysOfBirth.set(31, "аниме")

        yourName = `${firstNames.get(firstName)} ${daysOfBirth.get(dayOfBirth)}`
        return yourName
    },
    uniq: function(a) {
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
             var item = a[i];
             if(seen[item] !== 1) {
                   seen[item] = 1;
                   out[j++] = item;
             }
        }
        return out;
    },

}