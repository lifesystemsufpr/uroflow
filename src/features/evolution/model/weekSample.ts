export const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export const weekSample = {
  pee: [5, 6, 4, 7, 5, 6, 6],
  escape: [1, 0, 0, 2, 0, 0, 0],
  water: [400, 500, 300, 600, 450, 550, 650],
};

export const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const average = (values: number[]) => (values.length ? sum(values) / values.length : 0);
