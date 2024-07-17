import { useEffect, useMemo, useState } from "react";
import { Document, View, Page, Image, Text, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { ScreenLayout } from "../layouts/ScreenLayout";
import { SectionContainer } from "../layouts/SectionContainer";
import { ProgressLoading } from "../components/ProgressLoading";
import DragAndDrop from "../components/DragAndDrop";
import { LoadInfo } from "../components/LoadInfo";
import { useReadImageFilesWithWorker } from "../hooks/useReadImageFilesWithWorker";
import { transformImages } from '../helpers/loadFiles'

import { UploadFile } from "../types";

import ReadFilesWorker from '../webworkers/fileReaderWorker?worker'

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

const ContactSheetPDF = ({ images }:{ images: UploadFile[] }) => (
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


export default function ContactSheetScreen() {
  const worker = useMemo(() => new ReadFilesWorker(), [])
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { progress, readImageFiles, readFiles } = useReadImageFilesWithWorker(worker)

  useEffect(() => {
    return () => {
      worker.terminate()
    }
  }, [])

  const handleUploadFiles = async (files: File[]) => {
    setIsLoading(true)
    // const newFiles = await readImageFiles(files)
    const newFiles = await readFiles(files)
    console.log(newFiles)
    const optimizedFiles = await transformImages(newFiles)
    setFiles(prev => [...prev, ...optimizedFiles])
    setIsLoading(false)
  }

  if (isLoading) {
    return (<ProgressLoading title="Loading Photos..." progress={progress}/>)
  }

  return (
    <ScreenLayout>
      <SectionContainer>
        <DragAndDrop onFilesSelected={handleUploadFiles} files={files.map(file => file.file)} />
        <LoadInfo filesCount={files.length} onClearFiles={() => setFiles([])} />
        {files.length > 0 && (
        <PDFDownloadLink
          document={<ContactSheetPDF images={files} />}
          fileName="contact-sheet.pdf"
          className="button primary bold large"
        >
          {({ loading }) =>
            loading
              ? "Loading ..." : "Download PDF"
          }
        </PDFDownloadLink>
      )}
      </SectionContainer>
    </ScreenLayout>
  )
}
