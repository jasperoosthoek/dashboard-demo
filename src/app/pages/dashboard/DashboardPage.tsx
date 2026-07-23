import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import {
  useLocalization,
  SmallSpinner,
} from '@jasperoosthoek/react-toolbox';
import { r } from '../../resources';
import { useProjectStatusText } from '../projects/projectHooks';
import { formatCurrency, useFormatDate } from '../../localization/localization';

const DashboardPage = () => {
  const { text, lang } = useLocalization();
  const employees = r.employees.useList();
  const invoices = r.invoices.useList();
  const projects = r.projects.useList();
  const tasks = r.tasks.useList();
  const notes = r.notes.useList();
  const roles = r.roles.useList();
  const projectStatusText = useProjectStatusText();
  const formatDate = useFormatDate();

  // TEMPORARY DIAGNOSTIC - remove once "X.filter/find is not a function"
  // is root-caused. Logs the actual runtime shape of .data the instant it's
  // truthy but not an array, instead of just where the resulting crash lands.
  for (const [resourceName, data] of [
    ['employees', employees.data],
    ['invoices', invoices.data],
    ['projects', projects.data],
    ['tasks', tasks.data],
    ['notes', notes.data],
    ['roles', roles.data],
  ] as const) {
    if (data !== undefined && !Array.isArray(data)) {
      console.error(
        `[DIAGNOSTIC] ${resourceName}.data is not an array`,
        { typeofData: typeof data, data, dataJSON: JSON.stringify(data)?.slice(0, 500) },
      );
    }
  }

  const activeEmployees = employees.data?.filter(e => e.active);
  const openInvoices = invoices.data?.filter(inv => inv.status === 'open');
  const runningProjects = projects.data?.filter(p => p.status === 'in_progress');
  const overdueTasks = tasks.data?.filter(t => t.status !== 'done' && new Date(t.due_date) < new Date());

  // Chart: projects by status
  const projectStatusCounts = projects.data?.reduce((acc: Record<string, number>, p) => {
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
  const monthlyTotals = invoices.data?.reduce((acc: Record<string, number>, inv) => {
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
    projects.data && [...projects.data].sort(
      (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    ).slice(0, 5)
  );
  const latestNotes = (
    notes.data && [...notes.data].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 5)
  );

  return (
    <Container className='container-list'>
      {(!employees.data || !invoices.data || !projects.data || !tasks.data || !notes.data || !roles.data)? <SmallSpinner /> :
        <>
          {/* KPI Cards */}
          <Row className="mb-4">
            <Col md={3} title={runningProjects?.map(({ name }) => name)?.join('\n')}>
              <Card body>
                {text`active_projects`} <strong>{runningProjects?.length}</strong>
                </Card>
            </Col>
            <Col md={3} title={openInvoices?.map(({ project_id, amount }) => `${projects.find(project_id)?.name}: ${formatCurrency(amount)}`)?.join('\n')}>
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
              <Card body title={activeEmployees?.map(({ name, role_id }) => `${name} (${roles.find(role_id)?.name || text`not_found`})`)?.join('\n')}>
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
