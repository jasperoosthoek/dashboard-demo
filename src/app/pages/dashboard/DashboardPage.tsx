import { useEffect } from 'react';
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import {
  useLocalization,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';
import { use } from '../../stores/crudRegistry'
import { useProjectStatusText } from '../projects/projectHooks';
import { formatCurrency, useFormatDate } from '../../localization/localization';

const DashboardPage = () => {
  const { text, lang } = useLocalization();
  const employees = use.employees();
  const invoices = use.invoices();
  const projects = use.projects();
  const tasks = use.tasks();
  const notes = use.notes();
  const roles = use.roles();
  const projectStatusText = useProjectStatusText();
  const formatDate = useFormatDate();

  const activeEmployees = employees.list?.filter(e => e.active);
  const openInvoices = invoices.list?.filter(inv => inv.status === 'open');
  const runningProjects = projects.list?.filter(p => p.status === 'in_progress');
  const overdueTasks = tasks.list?.filter(t => t.status !== 'done' && new Date(t.due_date) < new Date());

  // Chart: projects by status
  const projectStatusCounts = projects.list?.reduce((acc: Record<string, number>, p) => {
    acc[projectStatusText(p.status)] = (acc[p.status] || 0) + 1;
    return acc;
  }, {}) || {};
  const projectPieData = {
    labels: Object.keys(projectStatusCounts),
    datasets: [
      {
        data: Object.values(projectStatusCounts),
        backgroundColor: ['#f0ad4e', '#5cb85c', '#999'],
      },
    ],
  };

  // Chart: invoice amounts per month
  const monthlyTotals = invoices.list?.reduce((acc: Record<string, number>, inv) => {
    const month = new Date(inv.due_date).toLocaleDateString(lang, { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + inv.amount;
    return acc;
  }, {}) || {};
  const invoiceBarData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: text`invoice_amounts`,
        data: Object.values(monthlyTotals ),
      },
    ],
  };

  const latestProjects = (
    projects.list && [...projects.list].sort(
      (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    ).slice(0, 5)
  );
  const latestNotes = (
    notes.list && [...notes.list].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 5)
  );

  return (
    <Container className='container-list'>
      {(!employees.list || !invoices.list || !projects.list || !tasks.list || !notes.list || !projects.record || !roles.record)? <SmallSpinner /> : 
        <>
          {/* KPI Cards */}
          <Row className="mb-4">
            <Col md={3} title={runningProjects?.map(({ name }) => name)?.join('\n')}>
              <Card body>
                {text`active_projects`} <strong>{runningProjects?.length}</strong>
                </Card>
            </Col>
            <Col md={3} title={openInvoices?.map(({ project_id, amount }) => `${projects.record && projects.record[project_id]?.name}: ${formatCurrency(amount)}`)?.join('\n')}>
              <Card body>
                {text`outstanding_invoices`} <strong>{formatCurrency(openInvoices?.reduce((sum, inv) => sum + inv.amount, 0) || 0)}</strong>
                </Card>
            </Col>
            <Col md={3}>
              <Card body title={overdueTasks?.map(({ title, due_date }) => `${title}: ${formatDate(due_date)}`)?.join('\n')}>
                {text`overdue_tasks`} <strong>{overdueTasks?.length}</strong>
                </Card>
            </Col>
            <Col md={3}>
              <Card body title={activeEmployees?.map(({ name, role_id }) => `${name} (${roles.record && roles.record[role_id]?.name || text`not_found`})`)?.join('\n')}>
                {text`active_employees`} <strong>{activeEmployees?.length}</strong>
                </Card>
            </Col>
          </Row>

          {/* Charts */}
          <Row className="mb-4">
            <Col md={6}>
              <Card>
                <Card.Header>{text`project_status`}</Card.Header>
                <Card.Body><Pie data={projectPieData} /></Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header>{text`invoice_amounts_per_month`}</Card.Header>
                <Card.Body><Bar data={invoiceBarData} /></Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent activity */}
          <Row>
            <Col md={6}>
              <Card>
                <Card.Header>{text`latest_projects`}</Card.Header>
                <Card.Body>
                  <ul>
                    {latestProjects?.map(p => (
                      <li key={p.id}>{p.name} — {formatDate(p.start_date)}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header>{text`latest_notes`}</Card.Header>
                <Card.Body>
                  <ul>
                    {latestNotes?.map(n => (
                      <li key={n.id}>{n.content} — {formatDate(n.created_at)}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      }
    </Container>
  );
};


export default DashboardPage
