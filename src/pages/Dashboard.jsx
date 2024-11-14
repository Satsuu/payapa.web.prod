import { useEffect, useState, useRef } from 'react'
import '../index.css'
import { Container, Breadcrumb, Button } from 'react-bootstrap'
import useAverageStatus from '../hooks/useAverageStatus'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { getAuth } from 'firebase/auth'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function Dashboard() {
  const { score } = useAverageStatus()
  const [chartData, setChartData] = useState(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const chartRef = useRef(null)

  useEffect(() => {
    const auth = getAuth()
    const currentUser = auth.currentUser
    if (currentUser && currentUser.email === 'super_admin@gmail.com') {
      setIsSuperAdmin(true)
    }
  }, [])

  useEffect(() => {
    const stressCounts = {
      Low: 0,
      Medium: 0,
      High: 0,
      'Very High': 0,
      Severe: 0,
    }

    score.forEach((entry) => {
      if (entry.stress_level in stressCounts) {
        stressCounts[entry.stress_level]++
      }
    })

    setChartData({
      labels: ['Low', 'Medium', 'High', 'Very High', 'Severe'],
      datasets: [
        {
          label: 'Number of Users',
          data: [
            stressCounts['Low'],
            stressCounts['Medium'],
            stressCounts['High'],
            stressCounts['Very High'],
            stressCounts['Severe'],
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
      ],
    })
  }, [score])

  const downloadPDF = async () => {
    const chartElement = chartRef.current
    if (!chartElement) return
    const canvas = await html2canvas(chartElement)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('landscape')
    pdf.addImage(imgData, 'PNG', 10, 10, 280, 150)
    pdf.save('stress_assessment_chart.pdf')
  }

  return (
    <>
      <Container className="mt-5">
        <Breadcrumb>
          <Breadcrumb.Item href="#" active>
            Dashboard
          </Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <div className="d-flex justify-content-end">
            {isSuperAdmin && (
              <Button variant="primary" className="mt-3" onClick={downloadPDF}>
                Download as PDF
              </Button>
            )}
          </div>
          {chartData && (
            <div ref={chartRef}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: 'Psychological Assessment',
                    },
                  },
                  scales: {
                    x: { title: { display: true, text: 'Level of Stress' } },
                    y: { title: { display: true, text: 'Number of Users' } },
                  },
                }}
              />
            </div>
          )}
        </div>
      </Container>
    </>
  )
}

export default Dashboard
