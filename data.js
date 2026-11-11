const TODAY = new Date('2026-11-11');
const d = (s) => new Date(s);

const STAFF = [
  {
    id: 1, name: 'Sarah Mitchell', role: 'Home Manager', dept: 'Management', photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    email: 'sarah.mitchell@hollymancare.co.uk', phone: '07700 900123', dob: '1983-04-12', ni: 'QQ 12 34 56 C', start: '2016-03-01', contract: 'Full-time', hours: 40, address: '14 Orchard Lane, Stafford, ST16 2AB',
    nok: { name: 'James Mitchell', rel: 'Husband', phone: '07700 900456' },
    docs: {
      dbs: { number: '001567432189', issued: '2025-02-14', expires: '2028-02-14', level: 'Enhanced with Barred Lists', update: true },
      licence: { number: 'MITCH804123S99AB', issued: '2021-06-10', expires: '2031-06-09', cats: 'B, BE' },
      passport: { number: '533219874', issued: '2020-09-01', expires: '2030-09-01', nationality: 'British' },
      rtw: { type: 'British Citizen', checked: '2016-02-20', expires: null },
      nmc: null,
    },
    training: [['Safeguarding Adults L3', '2026-01-10', '2027-01-10'], ['Manual Handling', '2025-11-20', '2026-11-20'], ['First Aid at Work', '2025-06-02', '2028-06-02'], ['Fire Safety', '2026-03-14', '2027-03-14'], ['Medication Management', '2026-05-08', '2027-05-08']],
    refs: 2, supervision: '2026-10-02',
  },
  {
    id: 2, name: 'David Okafor', role: 'Senior Care Assistant', dept: 'Care', photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'david.okafor@hollymancare.co.uk', phone: '07700 900234', dob: '1990-09-27', ni: 'QQ 65 43 21 A', start: '2019-07-15', contract: 'Full-time', hours: 37.5, address: '3 Mill Street, Stafford, ST17 4RT',
    nok: { name: 'Grace Okafor', rel: 'Sister', phone: '07700 900567' },
    docs: {
      dbs: { number: '001498712345', issued: '2023-12-04', expires: '2026-12-04', level: 'Enhanced with Barred Lists', update: false },
      licence: { number: 'OKAFO909276D99XY', issued: '2018-03-22', expires: '2028-03-21', cats: 'B' },
      passport: { number: '521088347', issued: '2019-01-15', expires: '2029-01-15', nationality: 'British' },
      rtw: { type: 'British Citizen', checked: '2019-07-01', expires: null },
      nmc: null,
    },
    training: [['Safeguarding Adults L2', '2025-12-01', '2026-12-01'], ['Manual Handling', '2026-02-11', '2027-02-11'], ['Dementia Awareness', '2026-04-19', '2027-04-19'], ['Fire Safety', '2026-03-14', '2027-03-14'], ['Infection Control', '2026-08-03', '2027-08-03']],
    refs: 2, supervision: '2026-09-18',
  },
  {
    id: 3, name: 'Priya Patel', role: 'Registered Nurse', dept: 'Nursing', photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    email: 'priya.patel@hollymancare.co.uk', phone: '07700 900345', dob: '1988-01-30', ni: 'QQ 98 76 54 B', start: '2021-01-11', contract: 'Part-time', hours: 30, address: '27 Elm Court, Stone, ST15 8LQ',
    nok: { name: 'Anil Patel', rel: 'Father', phone: '07700 900678' },
    docs: {
      dbs: { number: '001612009876', issued: '2024-05-20', expires: '2027-05-20', level: 'Enhanced with Barred Lists', update: true },
      licence: { number: 'PATEL801308P99CD', issued: '2016-11-02', expires: '2026-11-30', cats: 'B' },
      passport: { number: '507764120', issued: '2017-04-12', expires: '2027-04-12', nationality: 'British' },
      rtw: { type: 'British Citizen', checked: '2020-12-10', expires: null },
      nmc: { pin: '08A1234E', expires: '2027-09-30', revalidation: '2027-09-30' },
    },
    training: [['Safeguarding Adults L3', '2026-01-10', '2027-01-10'], ['Manual Handling', '2025-10-05', '2026-10-05'], ['Medication Management', '2026-05-08', '2027-05-08'], ['Catheter Care', '2025-09-16', '2028-09-16'], ['Fire Safety', '2026-03-14', '2027-03-14']],
    refs: 2, supervision: '2026-10-21',
  },
  {
    id: 4, name: 'Tomasz Kowalski', role: 'Care Assistant', dept: 'Care', photo: 'https://randomuser.me/api/portraits/men/75.jpg',
    email: 'tomasz.kowalski@hollymancare.co.uk', phone: '07700 900456', dob: '1995-06-08', ni: 'QQ 24 68 13 D', start: '2023-02-20', contract: 'Full-time', hours: 37.5, address: '9 Station Road, Stafford, ST16 3EN',
    nok: { name: 'Anna Kowalska', rel: 'Mother', phone: '+48 600 123 456' },
    docs: {
      dbs: { number: '001701234567', issued: '2023-02-01', expires: '2026-02-01', level: 'Enhanced with Barred Lists', update: false },
      licence: null,
      passport: { number: 'EB1234567', issued: '2022-07-19', expires: '2032-07-19', nationality: 'Polish' },
      rtw: { type: 'EU Settled Status', checked: '2023-02-10', expires: '2027-01-14', share: 'W1B-4K9-ZQ7' },
      nmc: null,
    },
    training: [['Safeguarding Adults L2', '2025-12-01', '2026-12-01'], ['Manual Handling', '2025-08-12', '2026-08-12'], ['Fire Safety', '2026-03-14', '2027-03-14'], ['Infection Control', '2026-08-03', '2027-08-03']],
    refs: 1, supervision: '2026-07-30',
  },
  {
    id: 5, name: 'Emma Thompson', role: 'Activities Coordinator', dept: 'Wellbeing', photo: 'https://randomuser.me/api/portraits/women/12.jpg',
    email: 'emma.thompson@hollymancare.co.uk', phone: '07700 900567', dob: '1998-11-19', ni: 'QQ 11 22 33 A', start: '2024-04-08', contract: 'Part-time', hours: 24, address: '51 Rowan Drive, Stafford, ST18 9PL',
    nok: { name: 'Linda Thompson', rel: 'Mother', phone: '07700 900789' },
    docs: {
      dbs: { number: '001755550011', issued: '2024-03-12', expires: '2027-03-12', level: 'Enhanced with Barred Lists', update: true },
      licence: { number: 'THOMP911198E99EF', issued: '2020-02-14', expires: '2030-02-13', cats: 'B' },
      passport: { number: '561100239', issued: '2021-10-05', expires: '2031-10-05', nationality: 'British' },
      rtw: { type: 'British Citizen', checked: '2024-03-25', expires: null },
      nmc: null,
    },
    training: [['Safeguarding Adults L2', '2026-01-10', '2027-01-10'], ['Manual Handling', '2026-04-22', '2027-04-22'], ['Dementia Awareness', '2026-04-19', '2027-04-19'], ['Fire Safety', '2026-03-14', '2027-03-14']],
    refs: 2, supervision: '2026-10-15',
  },
];
