import { Document, Image, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { UploadFile } from "../types";


const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  view: {
    width: '23%',
    height: 'auto',
    gap: 5,
  },
  text: {
    color: 'white',
    fontSize: 10,
    alignSelf: 'center',
  }
});

export const ContactSheetPDF = ({ images }:{ images: UploadFile[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {images.map((image, index) => ( image.url &&
        <View style={styles.view} key={index}>
          <Image src={image.url} />
          <Text style={styles.text}>{image.file.name}</Text>
        </View>
      ))}
    </Page>
  </Document>
);
