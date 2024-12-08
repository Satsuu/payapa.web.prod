import React, { useEffect, useState, useRef } from 'react'
import { Pie } from 'react-chartjs-2'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { Spinner } from 'react-bootstrap'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

function AppointmentHistory({ title, firestoreCollection, onDownload }) {
  const [chartData, setChartData] = useState(null)
  const [legendData, setLegendData] = useState(null)
  const chartRef = useRef(null)

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore()
        const querySnapshot = await getDocs(collection(db, firestoreCollection))
        const data = {}
        const legendDetails = {}

        querySnapshot.forEach((doc) => {
          const course = doc.data().course
          const role = doc.data().role

          if (!course) return

          // Aggregate count by course
          data[course] = (data[course] || 0) + 1

          // Organize roles for legend
          if (!legendDetails[course]) {
            legendDetails[course] = {}
          }
          legendDetails[course][role] = (legendDetails[course][role] || 0) + 1
        })

        const labels = Object.keys(data)
        const values = Object.values(data)
        const randomColors = values.map(() => getRandomColor())

        setChartData({
          labels,
          datasets: [
            {
              label: 'Count by Course',
              data: values,
              backgroundColor: randomColors,
              hoverOffset: 4,
            },
          ],
        })

        setLegendData({ legendDetails, colors: randomColors })
      } catch (error) {
        console.error('Error fetching Firestore data:', error)
      }
    }

    fetchData()
  }, [firestoreCollection])

  const handleDownloadPDF = async () => {
    if (!chartRef.current) return;
  
    const canvas = await html2canvas(chartRef.current, {
      scale: 2,
    });
  
    const imgData = canvas.toDataURL('image/png');
  
    const pdf = new jsPDF('portrait', 'mm', 'a4');
  
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
  
    const templateUrl = "/pdf_template.png";
  
    try {
      const response = await fetch(templateUrl);
      const templateBlob = await response.blob();
      const templateUrlObject = URL.createObjectURL(templateBlob);
  
      // Add template background (header and footer included in template)
      pdf.addImage(templateUrlObject, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
      // Calculate chart placement and size
      const margin = 20; // Adjust margin for padding
      const chartWidth = pdfWidth - margin * 2;
      const chartHeight = (canvas.height * chartWidth) / canvas.width; // Maintain aspect ratio
  
      const chartX = (pdfWidth - chartWidth) / 2; // Center horizontally
      const chartY = 60; // Position below header
  
      pdf.addImage(imgData, 'PNG', chartX, chartY, chartWidth, chartHeight);
  
      // Save the PDF with appropriate title
      const formattedTitle = title ? title.replace(/\s+/g, '_').toLowerCase() : 'chart';
      pdf.save(`${formattedTitle}_chart.pdf`);
    } catch (error) {
      console.error("Error fetching the template:", error);
    }
  };
  
  

  // Expose download method
  useEffect(() => {
    if (onDownload) {
      onDownload(handleDownloadPDF)
    }
  }, [onDownload])

  return (
    <>
      {chartData && legendData ? (
        <div ref={chartRef} className="d-flex flex-column flex-md-row">
          <div
            style={{ flex: 1 }}
            className="d-flex justify-content-center align-items-center"
          >
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: title,
                  },
                  legend: {
                    display: false,
                  },
                },
              }}
              style={{ maxWidth: '400px', height: '400px' }}
            />
          </div>
          <div style={{ flex: 1, marginLeft: '20px' }}>
            <h5 className="mt-3 mt-md-0">Legend</h5>
            <ul className="list-unstyled mt-4">
              {Object.entries(legendData.legendDetails).map(
                ([course, roles], index) => {
                  const totalCount = Object.values(roles).reduce(
                    (sum, count) => sum + count,
                    0
                  )

                  return (
                    <li
                      key={course}
                      className="d-flex justify-content-between mb-3 align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <span
                          style={{
                            width: 20,
                            height: 20,
                            backgroundColor: legendData.colors[index],
                            display: 'inline-block',
                            marginRight: 10,
                            borderRadius: '50%',
                          }}
                        ></span>
                        <strong>{course}</strong>
                      </div>
                      <strong>{totalCount}</strong>
                    </li>
                  )
                }
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      )}
    </>
  )
}

export default AppointmentHistory
