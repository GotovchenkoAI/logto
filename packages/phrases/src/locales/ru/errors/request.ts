const request = {
  invalid_input: 'Неверный ввод. {{details}}',
  general: 'Произошла ошибка запроса.',
  range_not_satisfiable: 'Диапазон не удовлетворен.',
  feature_not_supported: 'Эта функция не поддерживается в текущей среде.',
  rate_limited: 'Слишком много запросов. Пожалуйста, повторите попытку позже.',
  message_rate_limited: 'Слишком много писем на этот адрес. Попробуйте позже.',
};

export default Object.freeze(request);
