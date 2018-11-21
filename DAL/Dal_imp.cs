﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE;
using DS;

namespace DAL
{
    public class DalImp : IDal
    {
        
        public void AddTest(Test newTest)
        {
            if (DataSource.Tests.Any(tester => tester.Id == newTest.Id))
                throw new Exception("the test already exist in the system");

            DataSource.Tests.Add(newTest);
        }

        public void AddTester(Tester newTester)
        {
            if (DataSource.Testers.Any(tester => tester.ID == newTester.ID))
                throw new Exception("the tester already exist in the system");

            DataSource.Testers.Add(newTester);
        }

        public void AddTrainee(Trainee newTrainee)
        {
            if (DataSource.Trainees.Any(t => t.ID == newTrainee.ID))
                throw new Exception("the trainee already exist in the system");

            DataSource.Trainees.Add(newTrainee);
        }

        public IEnumerator<Tester> GetAllTesters()
        {
            return DataSource.Testers.GetEnumerator();
        }

        public IEnumerator<Test> GetAllTests()
        {
            throw new NotImplementedException();
        }

        public IEnumerator<Trainee> GetAllTrainee()
        {
            throw new NotImplementedException();
        }

        public void RemoveTest(Test testToDelete)
        {
            if (DataSource.Tests.All(x => x.Id != testToDelete.Id))
                throw new Exception("Test doesn't exist");

            DataSource.Tests.Remove(testToDelete);
        }

        public void RemoveTester(Tester testerToDelete)
        {
            if (DataSource.Testers.All(x => x.ID != testerToDelete.ID))
                throw new Exception("Tester doesn't exist");

            DataSource.Testers.Remove(testerToDelete);
        }

        public void RemoveTrainee(Trainee traineeToDelete)
        {
            if (DataSource.Trainees.All(x => x.ID != traineeToDelete.ID))
                throw new Exception("Trainee doesn't exist");


            DataSource.Trainees.Remove(traineeToDelete);
        }

        public void UpdateTest(Test updatedTest)
        {
            if (DataSource.Tests.All(x => x.Id != updatedTest.Id))
                throw new Exception("Test doesn't exist");

            var test = DataSource.Tests.Find(t => t.Id == updatedTest.Id);
            DataSource.Tests.Remove(test);
            DataSource.Tests.Add(updatedTest);
        }

        public void UpdateTester(Tester updatedTester)
        {
            if (DataSource.Testers.All(x => x.ID != updatedTester.ID))
                throw new Exception("Tester doesn't exist");

            var tester = DataSource.Testers.Find(t => t.ID == updatedTester.ID);
            DataSource.Testers.Remove(tester);
            DataSource.Testers.Add(updatedTester);
        }

        public void UpdateTrainee(Trainee updatedTrainee)
        {
            if (DataSource.Trainees.All(x => x.ID != updatedTrainee.ID))
                throw new Exception("Trainee doesn't exist");

            var trainee = DataSource.Trainees.Find(t => t.ID == updatedTrainee.ID);
            DataSource.Trainees.Remove(trainee);
            DataSource.Trainees.Add(updatedTrainee);
        }
    }
}
