export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Projeto 1",
      description: "Descrição rápida do projeto",
      imageUrl: "URL_DA_IMAGEM_1",
      projectUrl: "LINK_DO_PROJETO_1"
    },
    // ... outros projetos
  ];

  return (
    <main className="projects">
      <h2>Meus Projetos</h2>
      <ul className="projects-list">
        {projects.map((project, index) => (
          <li 
            key={project.id} 
            className="project-card" 
            data-aos="fade-up" 
            data-aos-delay={index * 100}
            style={{ backgroundImage: `url(${project.imageUrl})` }} // Imagem como background
          >
            <a 
              href={project.projectUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="project-link"
            >
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}