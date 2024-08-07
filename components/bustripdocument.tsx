"use client"

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
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  busHeader: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
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
  idCol: { width: '10%' },
  nameCol: { width: '25%' },
  birthdateCol: { width: '15%' },
  passportCol: { width: '25%' },
  contactNumberCol: { width: '25%' },
});

Font.register({
  family: "Roboto",
  src:
    "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
});

const Bus = ({ bus }) => {
  return (
    <>
      <Text style={styles.busHeader}>{bus.header}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, styles.idCol]}>
            <Text style={styles.tableHeader}>№</Text>
          </View>
          <View style={[styles.tableCol, styles.nameCol]}>
            <Text style={styles.tableHeader}>Имя</Text>
          </View>
          <View style={[styles.tableCol, styles.birthdateCol]}>
            <Text style={styles.tableHeader}>Дата Рождения</Text>
          </View>
          <View style={[styles.tableCol, styles.passportCol]}>
            <Text style={styles.tableHeader}>Паспорт</Text>
          </View>
          <View style={[styles.tableCol, styles.contactNumberCol]}>
            <Text style={styles.tableHeader}>Контактный номер</Text>
          </View>
        </View>
        {bus.passengers.map((passenger, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={[styles.tableCol, styles.idCol]}>
              <Text style={styles.tableCell}>{passenger.id}</Text>
            </View>
            <View style={[styles.tableCol, styles.nameCol]}>
              <Text style={styles.tableCell}>{passenger.name}</Text>
            </View>
            <View style={[styles.tableCol, styles.birthdateCol]}>
              <Text style={styles.tableCell}>{passenger.birthdate}</Text>
            </View>
            <View style={[styles.tableCol, styles.passportCol]}>
              <Text style={styles.tableCell}>{passenger.passport}</Text>
            </View>
            <View style={[styles.tableCol, styles.contactNumberCol]}>
              <Text style={styles.tableCell}>{passenger.contactNumber}</Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

const PDFDocument = ({ header, date, roadTrack, buses }) => {
  return (
    <Document>
      {buses.map((bus, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <Text style={styles.header}>{header}</Text>
          <Text style={styles.subHeader}>Дата: {date}</Text>
          <Text style={styles.subHeader}>Маршрут: {roadTrack}</Text>
          <Bus bus={bus} />
        </Page>
      ))}
    </Document>
  );
};

export default PDFDocument;