using System;
using System.Collections.Generic;
using System.Linq;
using BE;
using BE.MainObjects;
using BE.Routes;
using DAL;

namespace BL
{
    /// <summary>
    ///     Get instance of BlImp
    /// </summary>
    public static class FactoryBl
    {
        private static BlImp _bl;

        /// <summary>
        ///     Get the object
        /// </summary>
        public static BlImp GetObject => _bl ?? (_bl = new BlImp());
    }

    /// <summary>
    ///     business logic implementation
    /// </summary>
    public class BlImp : IBl
    {
        private readonly IDal _dalImp = FactoryDal.GetObject;

        /// <summary>
        ///     deny access to c-tor
        /// </summary>
        internal BlImp()
        {
            //Block creating new instances 
        }

        #region Access Tester

        /// <summary>
        ///     Add a Tester
        /// </summary>
        /// <param name="newTester">The Tester to add</param>
        public void AddTester(Tester newTester)
        {
            //check if tester is ok
            if (AllTesters.Any(tester => tester.Id == newTester.Id)) throw new Exception("Tester exist already");
            if (Tools.GetAge(newTester.BirthDate) < Configuration.MinTesterAge)
                throw new Exception("The Tester is too young");
            if (newTester.Address == null) throw new Exception("Need to know tester address");
            if (newTester.BirthDate == DateTime.MinValue) throw new Exception("Invalid birth date");

            //add tester
            _dalImp.AddTester(newTester);
        }

        /// <summary>
        ///     Remove a Tester
        /// </summary>
        /// <param name="testerToDelete">The Tester to remove</param>
        public void RemoveTester(Tester testerToDelete)
        {
            if (AllTesters.All(tester => tester.Id != testerToDelete.Id)) throw new Exception("Tester doesn't exist");
            if (AllTests.Any(x => x.TesterId == testerToDelete.Id))
                throw new Exception("Tester Has " + AllTests.Count(x => x.TesterId == testerToDelete.Id) +
                                    " Tests. Please Delete Them First.");
            _dalImp.RemoveTester(testerToDelete);
        }

        /// <summary>
        ///     Update Tester
        /// </summary>
        /// <param name="updatedTester">The Tester to update</param>
        public void UpdateTester(Tester updatedTester)
        {
            //check if tester is ok
            if (AllTesters.All(tester => tester.Id != updatedTester.Id)) throw new Exception("tester doesn't exist");
            if (Tools.GetAge(updatedTester.BirthDate) < Configuration.MinTesterAge)
                throw new Exception("The Tester is too young");
            if (updatedTester.Address == null) throw new Exception("Need to know tester address");
            if (updatedTester.BirthDate == DateTime.MinValue) throw new Exception("Invalid birth date");

            //add tester
            _dalImp.UpdateTester(updatedTester);
        }

        #endregion

        #region Access Test

        /// <summary>
        ///     Add a Test
        /// </summary>
        /// <param name="newTest">The Test to add</param>
        public void AddTest(Test newTest)
        {
            //check if the test is ok
            var testMissingDate = newTest.TestTime == DateTime.MinValue;

            var testerExist = AllTesters.Any(tester => tester.Id == newTest.TesterId);

            var traineeExist = AllTrainees.Any(trainee => trainee.Id == newTest.TraineeId);

            var twoTestesTooClose = AllTests.Any(test =>
                test.TraineeId == newTest.TraineeId && test.LicenseType == newTest.LicenseType &&
                Math.Abs((newTest.TestTime - test.TestTime).TotalDays) < Configuration.MinTimeBetweenTests);

            // the trainee didn't the minimum number of lessens before test
            var lessThenMinLessons = AllTrainees.Any(trainee =>
                trainee.Id == newTest.TraineeId && trainee.LicenseTypeLearning.Any(l =>
                    l.License == newTest.LicenseType && l.NumberOfLessons < Configuration.MinLessons));

            var traineeIsLearningLicense = AllTrainees.Any(trainee =>
                trainee.Id == newTest.TraineeId &&
                trainee.LicenseTypeLearning.Any(l => l.License == newTest.LicenseType));

            var testerIsTeachingLicense = AllTesters.Any(tester =>
                tester.Id == newTest.TesterId && tester.LicenseTypeTeaching.Any(l => l == newTest.LicenseType));

            var tooManyTestInWeek =
                AllTests.Count(test =>
                    test.TesterId == newTest.TesterId && Tools.DatesAreInTheSameWeek(newTest.TestTime, test.TestTime)) +
                1 >
                AllTesters.First(tester => tester.Id == newTest.TesterId).MaxWeekExams;

            var traineeHasTestInSameTime = AllTests.Any(test =>
                test.TraineeId == newTest.TraineeId && newTest.TestTime == test.TestTime);
            var testerHasTestInSameTime =
                AllTests.Any(test => test.TesterId == newTest.TesterId && newTest.TestTime == test.TestTime);

            var traineeHasLicenseAlready = AllTests.Any(y =>
                y.TraineeId == newTest.TraineeId && y.Passed == true && y.LicenseType == newTest.LicenseType);

            var traineePassedTestAlready = AllTests.Any(test =>
                test.TraineeId == newTest.TraineeId && test.LicenseType == newTest.LicenseType && test.Passed == true);

            if (testMissingDate) throw new Exception("Enter a valid date");
            if (tooManyTestInWeek) throw new Exception("To many tests for tester");
            if (!traineeExist) throw new Exception("This trainee doesn't exist");
            if (!testerExist) throw new Exception("This tester doesn't exist");
            if (twoTestesTooClose)
                throw new Exception(
                    "The trainee has a already a test in " + Configuration.MinTimeBetweenTests + " days");
            if (lessThenMinLessons)
                throw new Exception("The trainee learned less then " + Configuration.MinLessons +
                                    " lessons which is the minimum");
            if (!traineeIsLearningLicense) throw new Exception("The trainee is not learning for this license");
            if (!testerIsTeachingLicense) throw new Exception("Tester is not qualified for this license type");
            if (traineeHasTestInSameTime) throw new Exception("The trainee has already another test in the same time");
            if (testerHasTestInSameTime) throw new Exception("The tester has already another test in the same time");
            if (traineeHasLicenseAlready) throw new Exception("The trainee has already a license with same type");
            if (traineePassedTestAlready) throw new Exception("The trainee already passed the test");


            //add the test
            _dalImp.AddTest(newTest);
        }

        /// <summary>
        ///     Remove a Test
        /// </summary>
        /// <param name="testToDelete">The Test to remove</param>
        public void RemoveTest(Test testToDelete)
        {
            if (AllTests.All(test => test.Id != testToDelete.Id))
                throw new Exception("Test doesn't exist");
            _dalImp.RemoveTest(testToDelete);
        }

        /// <summary>
        ///     Update Test
        /// </summary>
        /// <param name="updatedTest">The Test to update</param>
        public void UpdateTest(Test updatedTest)
        {
            //check if the test to update is ok
            if (AllTests.All(test => test.Id != updatedTest.Id))
                throw new Exception("Test doesn't exist");
            if (AllTests.Any(test =>
                test.Id == updatedTest.Id && (test.TesterId != updatedTest.TesterId ||
                                              test.TraineeId != updatedTest.TraineeId )))
                throw new Exception("Can't change this test details. please create new test");
            if (updatedTest.Criteria.Count <= Configuration.MinimumCriteria)
                throw new Exception("Not enough criterion");
            if (updatedTest.ActualTestTime == DateTime.MinValue)
                throw new Exception("Test date not updated");
            if ((updatedTest.ActualTestTime - updatedTest.TestTime).Days < 0)
                throw new Exception("Actual date can't be before test date time");
            //update passed status
            updatedTest.UpdatePassedTest();

            //update test
            _dalImp.UpdateTest(updatedTest);
        }

        #endregion

        #region Access Trainee

        /// <summary>
        ///     Add Trainee
        /// </summary>
        /// <param name="newTrainee">The Trainee to add</param>
        public void AddTrainee(Trainee newTrainee)
        {
            if (AllTrainees.Any(trainee => trainee.Id == newTrainee.Id))
                throw new Exception("Trainee already exist");
            if (Tools.GetAge(newTrainee.BirthDate) < Configuration.MinTraineeAge)
                throw new Exception("The trainee is too young");
            if (newTrainee.BirthDate == DateTime.MinValue)
                throw new Exception("Invalid birth date");

            _dalImp.AddTrainee(newTrainee);
        }

        /// <summary>
        ///     Remove Trainee
        /// </summary>
        /// <param name="traineeToDelete">The Trainee to remove</param>
        public void RemoveTrainee(Trainee traineeToDelete)
        {
            if (AllTrainees.All(trainee => trainee.Id != traineeToDelete.Id))
                throw new Exception("Trainee doesn't exist");
            if (AllTests.Any(x => x.TraineeId == traineeToDelete.Id))
                throw new Exception("Trainee Has " + AllTests.Count(x => x.TraineeId == traineeToDelete.Id) +
                                    " Tests. Please Delete Them First.");
            _dalImp.RemoveTrainee(traineeToDelete);
        }

        /// <summary>
        ///     Update Trainee
        /// </summary>
        /// <param name="updatedTrainee">The Trainee to update</param>
        public void UpdateTrainee(Trainee updatedTrainee)
        {
            if (AllTrainees.All(trainee => trainee.Id != updatedTrainee.Id))
                throw new Exception("Trainee doesn't exist");
            if (Tools.GetAge(updatedTrainee.BirthDate) < Configuration.MinTraineeAge)
                throw new Exception("The trainee is too young");
            if (updatedTrainee.BirthDate == DateTime.MinValue)
                throw new Exception("Invalid birth date");

            _dalImp.UpdateTrainee(updatedTrainee);
        }

        #endregion

        #region Get list's

        /// <summary>
        ///     Get All Trainee's
        /// </summary>
        public IEnumerable<Trainee> AllTrainees => _dalImp.AllTrainee;

        /// <summary>
        ///     Get all Tester's
        /// </summary>
        public IEnumerable<Tester> AllTesters => _dalImp.AllTesters;

        /// <summary>
        ///     Get all Test's
        /// </summary>
        public IEnumerable<Test> AllTests => _dalImp.AllTests;

        /// <summary>
        ///     Get all the Testers that are available on the date
        /// </summary>
        /// <param name="date">day and hour for checking availability</param>
        /// <returns>available testers in this time</returns>
        public IEnumerable<Tester> GetAvailableTesters(DateTime date)
        {
            return AllTesters.Where(tester =>
                tester.Schedule.IsAvailable(date.DayOfWeek, date.Hour) &&
                !AllTests.Any(test =>
                    test.TesterId == tester.Id && test.TestTime.DayOfWeek == date.DayOfWeek &&
                    test.TestTime.Hour == date.Hour)
            );
        }

        /// <summary>
        ///     Get all Tests sorted by Date
        /// </summary>
        /// <returns>List of Tests</returns>
        public IEnumerable<Test> GetAllTestsSortedByDate()
        {
            return AllTests.OrderBy(x => x.TestTime);
        }

        /// <summary>
        ///     Get all tests where the function returns true
        /// </summary>
        /// <param name="func">A func that gets a Test and return bool if condition == true</param>
        /// <returns>List of Tests</returns>
        public IEnumerable<Test> GetAllTestsWhere(Func<Test, bool> func)
        {
            return AllTests.Where(func);
        }

        /// <summary>
        ///     Get all the testers that are in a specified distance from an address.
        ///     This function uses requests from internet. in can take a long time ,so it is recommended to use in a ///separate
        ///     thread.
        /// </summary>
        /// <param name="r">the distance</param>
        /// <param name="a">the address</param>
        /// <returns></returns>
        public IEnumerable<Tester> GetAllTestersInRadios(int r, Address a)
        {
            return AllTesters.Where(tester =>
                tester.Address != null && Routes.GetDistanceGoogleMapsApi(tester.Address, a) <= r);
        }

        /// <summary>
        ///     Get all the test in the month
        /// </summary>
        /// <param name="date">the month</param>
        /// <returns></returns>
        public IEnumerable<Test> GetAllTestInMonth(DateTime date)
        {
            return from test in AllTests
                where test.TestTime.Month == date.Month && test.TestTime.Year == date.Year
                select test;
        }

        /// <summary>
        ///     Get all the tests in the day
        /// </summary>
        /// <param name="date">the day</param>
        /// <returns></returns>
        public IEnumerable<Test> GetAllTestInDay(DateTime date)
        {
            return from test in AllTests
                where test.TestTime.DayOfYear == date.DayOfYear && test.TestTime.Year == date.Year
                select test;
        }


        /// <summary>
        ///     Get all the testers that are the best for the test ordered by the distance from the address
        /// </summary>
        /// <param name="address">the address</param>
        /// <param name="license">the license type</param>
        /// <returns>testers list </returns>
        public IEnumerable<Tester> GetTestersByDistance(Address address, LicenseType license)
        {
            var testerDistance =
                from tester in AllTesters
                where tester.Address != null
                let distance = Routes.GetDistanceGoogleMapsApi(address, tester.Address)
                select new {tester, distance};
            var testerDistanceList = testerDistance.ToList();
            if (!testerDistanceList.Any())
                throw new Exception("There are no testers in the current address please try an other address");

            var testerLicense =
                from tester in testerDistanceList
                where tester.tester.LicenseTypeTeaching.Any(x => x == license)
                orderby tester.distance
                select tester.tester;
            var testersByDistanceList = testerLicense.ToList();
            if (!testersByDistanceList.Any())
                throw new Exception("There is no tester with the right license in the current date and location");

            return testersByDistanceList;
        }

        /// <summary>
        ///     get all tests that the results are not updated
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Test> GetAllTestsToCome()
        {
            return AllTests.Where(test => test.Passed == null);
        }

        /// <summary>
        ///     get all tests that the done already
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Test> GetAllDoneTests()
        {
            bool DoneTests(Test test)
            {
                return test.Passed != null;
            }

            return AllTests.Where(DoneTests);
        }

        /// <summary>
        ///     Get all the trainee that passed test today
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public IEnumerable<Trainee> GetAllTraineeThatPassedToday(DateTime date)
        {
            return
                from test in AllTests
                where test.ActualTestTime.DayOfYear == date.DayOfYear && test.ActualTestTime.Year ==
                      date.Year && test.Passed == true
                select AllTrainees.First(x => x.Id == test.TraineeId);
        }

        /// <summary>
        ///     Get all the trainee that fail in the test today
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public IEnumerable<Trainee> GetAllTraineeThatDidNotPassedToday(DateTime date)
        {
            return from test in AllTests
                where test.ActualTestTime.DayOfYear == date.DayOfYear && test.ActualTestTime.Year ==
                      date.Year && test.Passed == false
                select AllTrainees.First(x => x.Id == test.TraineeId);
        }

        #endregion

        #region Grouping

        /// <summary>
        ///     Get all Tester's grouped by License
        /// </summary>
        /// <returns>All Tester's grouped by license</returns>
        public IEnumerable<IGrouping<List<LicenseType>, Tester>> GetAllTestersByLicense(bool sorted = false)
        {
            return (sorted ? AllTesters.OrderBy(x => x.Id) : AllTesters).GroupBy(x => x.LicenseTypeTeaching);
        }

        /// <summary>
        ///     Get all Trainee's grouped by Their Tester's
        /// </summary>
        /// <returns>All Trainee's grouped by Their Tester's </returns>
        public IEnumerable<IGrouping<string, Trainee>> GetAllTraineesByTester(bool sorted = false)
        {
            return
                sorted
                    ? from trainee in AllTrainees
                    orderby trainee.Id
                    group trainee by trainee.TeacherName

                    // if not sorted
                    : from trainee in AllTrainees
                    group trainee by trainee.TeacherName;
        }

        /// <summary>
        ///     Get all Trainee's grouped by Their school's
        /// </summary>
        /// <returns>All Trainee's grouped by Their school's </returns>
        public IEnumerable<IGrouping<string, Trainee>> GetAllTraineesBySchool(bool sorted = false)
        {
            return
                sorted
                    ? from trainee in AllTrainees
                    orderby trainee.Id
                    group trainee by trainee.SchoolName
                    : from trainee in AllTrainees
                    orderby trainee.Id
                    group trainee by trainee.SchoolName;
        }

        /// <summary>
        ///     Get all Trainee's grouped by Their number of test's
        /// </summary>
        /// <returns>All Trainee's grouped by Their number of test's</returns>
        public IEnumerable<IGrouping<int, Trainee>> GetAllTraineeByNumberOfTests(bool sorted = false)
        {
            return (sorted ? AllTrainees.OrderBy(x => x.Id) : AllTrainees).GroupBy(GetNumberOfTests);
        }

        /// <summary>
        ///     Get all tests shorted by license
        /// </summary>
        /// <param name="sorted">if sorted</param>
        /// <returns></returns>
        public IEnumerable<IGrouping<LicenseType?, Test>> GetAllTestsByLicense(bool sorted = false)
        {
            return (sorted ? AllTests.OrderBy(x => x.Id) : AllTests).GroupBy(x => x.LicenseType);
        }

        /// <summary>
        ///     Get all trainee shorted by license
        /// </summary>
        /// <param name="sorted">if sorted</param>
        /// <returns></returns>
        public IEnumerable<IGrouping<List<LicenseType>, Trainee>> GetAllTraineesByLicense(bool sorted = false)
        {
            return (sorted ? AllTrainees.OrderBy(x => x.Id) : AllTrainees).GroupBy(x =>
                x.LicenseTypeLearning.Select(y => y.License).ToList());
        }

        #endregion

        #region Help Function's

        /// <summary>
        ///     Save Configuration to xml file
        /// </summary>
        public void SaveSettings()
        {
            _dalImp.SaveConfigurations();
        }

        /// <summary>
        ///     Get the number of tests that the Trainee did
        /// </summary>
        /// <param name="trainee">Trainee</param>
        /// <returns>The number of Tests trainee has</returns>
        public int GetNumberOfTests(Trainee trainee)
        {
            return AllTests.Count(x => x.TraineeId == trainee.Id);
        }

        /// <summary>
        ///     Check if Trainee Passed the test
        /// </summary>
        /// <param name="trainee">The Trainee</param>
        /// <param name="license">The license</param>
        /// <returns>True if he Passed</returns>
        public bool TraineePassedTest(Trainee trainee, LicenseType license)
        {
            return AllTests.Any(test =>
                test.TesterId == trainee.Id && test.LicenseType == license && test.Passed == true);
        }

        #endregion

        #region SearchTrainee

        /// <summary>
        ///     Free search in trainees
        /// </summary>
        /// <param name="key"></param>
        /// <returns>fitting trainees</returns>
        public IEnumerable<Trainee> SearchTrainee(string key)
        {
            var keys = key.ToLower().Split();
            keys = keys.Where(x => x != "").ToArray();


            return AllTrainees.AsParallel().AsOrdered().Where(x => keys.Any(y =>
                x.Id.ToString().ToLower().Contains(y) ||
                x.FirstName?.ToLower().Contains(y) == true ||
                x.LastName?.ToLower().Contains(y) == true ||
                x.SchoolName?.ToLower().Contains(y) == true ||
                x.Address?.ToString().ToLower().Contains(y) == true ||
                x.TeacherName?.ToLower().Contains(y) == true ||
                x.EmailAddress?.ToLower().Contains(y) == true ||
                x.PhoneNumber?.ToLower()?.Contains(y) == true));
        }

        /// <summary>
        ///     Free search in trainees
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public IEnumerable<Tester> SearchTester(string key)
        {
            var keys = key.ToLower().Split();
            keys = keys.Where(x => x != "").ToArray();


            return AllTesters.Where(x => keys.Any(y =>
                x.Id.ToString().ToLower().Contains(y) ||
                x.FirstName?.ToLower().Contains(y) == true ||
                x.LastName?.ToLower().Contains(y) == true ||
                x.Address?.ToString().ToLower().Contains(y) == true ||
                x.EmailAddress?.ToLower().Contains(y) == true ||
                x.PhoneNumber?.ToLower().Contains(y) == true));
        }

        /// <summary>
        ///     Free search in trainees
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public IEnumerable<Test> SearchTest(string key)
        {
            var keys = key.ToLower().Split();
            keys = keys.Where(x => x != "").ToArray();


            return AllTests.Where(x => keys.Any(y =>
                x.Id.ToString().ToLower().Contains(y) ||
                x.AddressOfBeginningTest?.ToString().ToLower().Contains(y) == true ||
                x.TraineeId.ToString().ToLower().Contains(y) ||
                x.TesterId.ToString().ToString().ToLower().Contains(y) ||
                x.Comment?.ToLower().Contains(y) == true));
        }

        #endregion
    }
}