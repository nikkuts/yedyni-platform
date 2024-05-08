export const convertStartDate = (startDate) => {
  // Створюємо новий об'єкт дати з переданого значення
  const objDate = new Date(startDate);

  // Встановлюємо часовий пояс на "Europe/Kiev"
  const kyivObjDate = new Date(objDate.toLocaleString('en-US', { timeZone: 'Europe/Kiev' }));

  // Встановлюємо час на початок доби (00:00:00)
  kyivObjDate.setHours(0, 0, 0, 0);

  // Повертаємо час у мілісекундах
  return kyivObjDate.getTime();
};

export const convertEndDate = (endDate) => {
  // Створюємо новий об'єкт дати з переданого значення
  const objDate = new Date(endDate);

  // Встановлюємо часовий пояс на "Europe/Kiev"
  const kyivObjDate = new Date(objDate.toLocaleString('en-US', { timeZone: 'Europe/Kiev' }));

  // Встановлюємо час на кінець доби (23:59:59)
  kyivObjDate.setHours(23, 59, 59, 999);

  // Повертаємо час у мілісекундах
  return kyivObjDate.getTime();
};

export const formatDate = (date) => {
  const kyivStringDate = new Date(date).toLocaleDateString('en-US', { timeZone: 'Europe/Kiev' });
  const dateParts = kyivStringDate.split('/');
  
  const year = dateParts[2];
  const month = ('0' + dateParts[0]).slice(-2); 
  const day = ('0' + dateParts[1]).slice(-2);

  return `${day}-${month}-${year}`;
};

export const formatDateTime = (milliseconds) => {
  const date = new Date(milliseconds);
  
  // Отримання назви місяця українською мовою та в родовому відмінку
  const monthNames = new Intl.DateTimeFormat('uk-UA', { month: 'long', day: 'numeric' }).formatToParts(date);
  const month = monthNames.find(part => part.type === 'month').value;
  
  // Отримання числа місяця
  const day = date.getDate();
  
  // Отримання годин та хвилин
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}, ${day} ${month}`;
};

export const getNextPaymentDate = (lastPaymentDate) => {
  const objDate = new Date(lastPaymentDate);
  const kyivObjDate = new Date(objDate.toLocaleString('en-US', { timeZone: 'Europe/Kiev' }));
  const originalDay = kyivObjDate.getDate();

  kyivObjDate.setMonth(kyivObjDate.getMonth() + 1);
  kyivObjDate.setDate(originalDay);

  const year = kyivObjDate.getFullYear();
  const month = ('0' + (kyivObjDate.getMonth() + 1)).slice(-2); 
  const day = ('0' + kyivObjDate.getDate()).slice(-2);
  
  return `${day}-${month}-${year}`;
};

export const getDifferenceInDays = (date) => {
  // Створюємо новий об'єкт дати з переданого значення
  const objDate = new Date(date);
  
  // Встановлюємо часовий пояс на "Europe/Kiev"
  const kyivObjDate = new Date(objDate.toLocaleString('en-US', { timeZone: 'Europe/Kiev' }));
  
  // Встановлюємо час на початок доби (00:00:00)
  kyivObjDate.setHours(0, 0, 0, 0);

  // Повертаємо час у мілісекундах
  const kyivObjDateTime = kyivObjDate.getTime();

  const currentDate = new Date();
  const kyivCurrentDate = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Europe/Kiev' }));
  const kyivCurrentDateTime = kyivCurrentDate.getTime();
  
  const differenceInDays = Math.floor((kyivCurrentDateTime - kyivObjDateTime) / (1000 * 60 * 60 * 24));
  
  return differenceInDays;
};