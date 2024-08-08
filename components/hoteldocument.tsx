import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily : "Roboto"
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 8,
    textAlign: 'center',
  },
  tableHeader: {
    margin: 'auto',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roomNumberCol: { width: '15%' },
  roomTypeCol: { width: '20%' },
  nameCol: { width: '25%' },
  passportCol: { width: '25%' },
  birthDateCol: { width: '15%' },
});

Font.register({
  family: "Roboto",
  src:
    "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
});


// Room capacity dictionary
const roomCapacities = {
  'single': 1,
  'double': 2,
  'triple': 3,
  'lux': 4  // Assuming max capacity for lux is 4
};

const Room = ({ room, roomIndex }) => {
  const rowsToRender = room.occupants.length;

  return (
    <>
      {Array.from({ length: rowsToRender }).map((_, personIndex) => {
        const person = room.occupants[personIndex] || {};
        return (
          <View style={styles.tableRow} key={`${roomIndex}-${personIndex}`}>
            {personIndex === 0 ? (
              <>
                <View style={[styles.tableCol, styles.roomNumberCol]}>
                  <Text style={styles.tableCell}>{roomIndex + 1}</Text>
                </View>
                <View style={[styles.tableCol, styles.roomTypeCol]}>
                  <Text style={styles.tableCell}>{room.type}</Text>
                </View>
              </>
            ) : (
              <>
                <View style={[styles.tableCol, styles.roomNumberCol]}></View>
                <View style={[styles.tableCol, styles.roomTypeCol]}></View>
              </>
            )}
            <View style={[styles.tableCol, styles.nameCol]}>
              <Text style={styles.tableCell}>{person.name || ''}</Text>
            </View>
            <View style={[styles.tableCol, styles.passportCol]}>
              <Text style={styles.tableCell}>{person.passport || ''}</Text>
            </View>
            <View style={[styles.tableCol, styles.birthDateCol]}>
              <Text style={styles.tableCell}>{person.birthdate || ''}</Text>
            </View>
          </View>
        );
      })}
    </>
  );
};

const PDFDocument = ({ header, rooms, people }) => {
  const groupedRooms = rooms.map(room => ({
    ...room,
    occupants: room.occupants.map(occupantName => 
      people.find(p => p.name === occupantName) || { name: occupantName }
    )
  }));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{header}</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, styles.roomNumberCol]}>
              <Text style={styles.tableHeader}>№ Комнаты</Text>
            </View>
            <View style={[styles.tableCol, styles.roomTypeCol]}>
              <Text style={styles.tableHeader}>Тип комнаты</Text>
            </View>
            <View style={[styles.tableCol, styles.nameCol]}>
              <Text style={styles.tableHeader}>Имя</Text>
            </View>
            <View style={[styles.tableCol, styles.passportCol]}>
              <Text style={styles.tableHeader}>Паспорт</Text>
            </View>
            <View style={[styles.tableCol, styles.birthDateCol]}>
              <Text style={styles.tableHeader}>Дата Рождения</Text>
            </View>
          </View>
          {groupedRooms.map((room, index) => (
            <Room key={index} room={room} roomIndex={index} />
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;