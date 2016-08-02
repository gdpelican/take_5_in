namespace :setup do
  desc "Prepare assets locally"
  task :compile do
      run_locally do
      [
        'git branch -D cap-deploy',
        'git checkout -b cap-deploy',
        'npm run compile',
        'git add . -f',
        'git commit -m "Production push"',
        'git checkout master'
      ].each { |cmd| %x{#{cmd}} }
    end
  end
end
